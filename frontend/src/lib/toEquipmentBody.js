export const toEquipmentBody = ({ serial, type, status, siteId, nextServiceOn }) => ({
  serial,
  type,
  status,
  siteId,
  nextServiceOn: nextServiceOn.slice(0, 10),
});
