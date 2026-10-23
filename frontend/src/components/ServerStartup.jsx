import { useServerStartup } from '../hooks/useServerStartup';
import StartupCard from './StartupCard';
import StartupFailedCard from './StartupFailedCard';

const ServerStartup = ({ children }) => {
  const startup = useServerStartup();

  if (startup.phase === 'ready') return children;
  if (startup.phase === 'checking') return null;

  return (
    <div className="startup">
      {startup.phase === 'failed' ? (
        <StartupFailedCard database={startup.database} onRetry={startup.retry} />
      ) : (
        <StartupCard startedAt={startup.startedAt} />
      )}
    </div>
  );
};

export default ServerStartup;
