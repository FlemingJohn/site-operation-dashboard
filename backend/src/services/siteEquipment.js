export const moveToStock = (client, siteId) =>
  client.query(
    `UPDATE equipment
     SET status = 'in_stock', site_id = NULL
     WHERE site_id = $1`,
    [siteId]
  );
