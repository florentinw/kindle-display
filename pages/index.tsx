import useSWR from 'swr'
import fetch from 'node-fetch'

const fetchData = async () => {
  const r = await fetch('/api/weather', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: '' }),
  })
  const response = await r.json()
  if (response.error) {
    const error = new Error('irgendein error ahah')
    throw error
  }
  return response
}

const Dashboard = ({ serverData }) => {
  const { data, error } = useSWR('', fetchData, {
    refreshInterval: 15 * 60 * 1000,
    initialData: serverData,
  })

  return (
    <div className="rotate">
      {error ? <p style={{ color: 'red' }}>{error.message}</p> : null}
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
    </div>
  )
}

export default Dashboard

export const getStaticProps = async () => {
  const serverData = await fetchData()
  return { props: { serverData } }
}
