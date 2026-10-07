import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toFieldErrors } from '../validation/commonSchemas';

export const useEntityForm = ({
  id,
  emptyValues,
  load,
  toFormValues,
  schema,
  save,
  entityName,
  successPath,
}) => {
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (!id) return undefined;

    let isCurrent = true;
    setIsLoading(true);

    load(id)
      .then((entity) => {
        if (isCurrent) setValues(toFormValues(entity));
      })
      .catch((err) => {
        if (isCurrent) setLoadError(err.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id, load, toFormValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = schema.safeParse(values);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await save(result.data, id, idempotencyKey);
      navigate(successPath, {
        state: { message: `${entityName} ${isEditing ? 'updated' : 'added'}` },
      });
    } catch (err) {
      setErrors(err.errors ?? {});
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isEditing,
    isLoading,
    loadError,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
