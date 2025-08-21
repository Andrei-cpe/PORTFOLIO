import React, { useEffect, useState } from "react";

const DomainList = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        // 1. Fetch the domains
        const res = await fetch("http://localhost:5000/api/domain/100");
        if (!res.ok) throw new Error(`Domain fetch error: ${res.status}`);
        const data = await res.json();

        // 2. Fetch records for each zone
        const domainsWithRecords = await Promise.all(
          data.map(async (domain) => {
            const zonesWithRecords = await Promise.all(
              domain.zones.map(async (zone) => {
                try {
                  // Extract zone ID from URI (e.g., /zones/2 → 2)
                  const zoneId = zone.uri.split("/").pop();
                  const zoneRes = await fetch(`http://localhost:5000/api/zones/${zoneId}`);
                  if (!zoneRes.ok) throw new Error(`Zone fetch error: ${zoneRes.status}`);
                  const zoneData = await zoneRes.json();
                  return { name: zone.name, records: zoneData.records || [] };
                } catch (zoneErr) {
                  console.error(zoneErr);
                  return { name: zone.name, records: [] };
                }
              })
            );
            return { name: domain.name, zones: zonesWithRecords };
          })
        );

        setDomains(domainsWithRecords);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Domains and DNS Records</h1>
      {domains.map((domain, i) => (
        <div key={i} style={{ marginBottom: "2rem" }}>
          <h2>{domain.name}</h2>
          {domain.zones.map((zone, j) => (
            <div key={j} style={{ marginLeft: "1rem" }}>
              <h3>{zone.name}</h3>
              {zone.records.length > 0 ? (
                <table border="1" cellPadding="5" style={{ marginLeft: "1rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Content</th>
                      <th>TTL</th>
                      <th>Priority</th>
                      <th>Change Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zone.records.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{record.name}</td>
                        <td>{record.type}</td>
                        <td>{record.content}</td>
                        <td>{record.ttl}</td>
                        <td>{record.prio}</td>
                        <td>{record.change_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No records found</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DomainList;
