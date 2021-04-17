import useSWR from 'swr'

const fetchData = async (url) => {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: '',
    }),
  })
  const response = await r.json()
  if (response.error) {
    const error = new Error(response.error)
    throw error
  }
  return response
}

const Dashboard = () => {
  const { data, error } = useSWR('/api/weather', fetchData, {
    refreshInterval: 15 * 60 * 1000,
  })

  return (
    <div className="rotate">
      {error ? <p style={{ color: 'red' }}>{error.message}</p> : null}
      {data && (
        <div className="container">
          <div className="header">
            {data.header.map((group, i) => (
              <div className="group" key={i}>
                <span className="label">{group.label}</span>
                <span className="temperature big">{group.value}</span>
              </div>
            ))}
          </div>
          <div className="row">
            {data.body[0].map((group, i) => (
              <div className="group" key={i}>
                <span className="label">{group.label}</span>
                <span className="temperature">{group.value}</span>
              </div>
            ))}
          </div>
          <div className="row">
            {data.body[1].map((group, i) => (
              <div className="group" key={i}>
                <span className="label">{group.label}</span>
                <span className="temperature">{group.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
