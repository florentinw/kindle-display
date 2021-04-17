import type { NextApiRequest, NextApiResponse } from 'next'

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

const weather = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(500).json({ message: 'method not allowed' })

  try {
    let accessToken = ''
    if (req.body.accessToken && req.body.accessToken !== '') {
      accessToken = req.body.accessToken
    } else {
      accessToken = await getAccessToken()
    }

    const data = await getData(accessToken)
    return res
      .status(200)
      .json({ header: data.header, body: data.body, accessToken })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default weather
