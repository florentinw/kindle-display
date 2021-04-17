import useSWR from 'swr'

const fetchData = async () => {
  const r = await fetch('http://localhost:3000/api/weather', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: '' }),
  })
  const response = await r.json()
  if (response.error) throw response.error
  return response
}

const Dashboard = ({ serverData }) => {
  const { data, error } = useSWR('', fetchData, {
    refreshInterval: 15 * 60 * 1000,
    initialData: serverData,
  })

  return (
    <div className="rotate">
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
