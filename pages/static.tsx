import Head from 'next/head'

const Dashboard = ({ data }) => (
  <>
    <Head>
      <meta http-equiv="refresh" content={(60 * 15).toString()} />
    </Head>
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
  </>
)

export default Dashboard

const getData = async (accessToken: string) => {
  const r = await fetch(
    'https://api.netatmo.com/api/getstationsdata?get_favorites=false',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  const response = await r.json()
  const device = response?.body?.devices[0]

  const data = {
    header: [
      {
        label: 'Draußen',
        value: `${
          device.modules?.find((item) => item.module_name === 'Balkon')
            ?.dashboard_data?.Temperature
        }°`,
      },
    ],
    body: [
      [
        {
          label: 'Innen',
          value: `${device?.dashboard_data?.Temperature}°`,
        },
        {
          label: 'CO2',
          value: device?.dashboard_data?.CO2,
        },
        {
          label: 'Luftfeuchtigkeit',
          value: `${device?.dashboard_data?.Humidity}%`,
        },
      ],
      [
        {
          label: 'Luftfeuchtigkeit',
          value: `${
            device.modules?.find((item) => item.module_name === 'Balkon')
              ?.dashboard_data?.Humidity
          }%`,
        },
      ],
    ],
  }
  return data
}

const getAccessToken = async () => {
  const r = await fetch('https://api.netatmo.com/oauth2/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    }),
  })
  const response = await r.json()
  if (!response.access_token) throw new Error('no access token')

  return response.access_token
}

export const getServerSideProps = async (context) => {
  const accessToken = await getAccessToken()

  const data = await getData(accessToken)

  return {
    props: {
      data: {
        header: data.header,
        body: data.body,
        accessToken,
      },
    },
  }
}
