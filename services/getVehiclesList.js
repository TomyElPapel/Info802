
const query = `query vehicleList($page: Int, $size: Int, $search: String) {
    vehicleList(
      page: $page, 
      size: $size, 
      search: $search, 
    ) {
      id
      naming {
        make
        model
      }
      media {
        image {
          thumbnail_url
        }
      }
      range {
        chargetrip_range {
          worst
          best
        }
      }
      connectors {
        time
      }
    }
  }`;

async function getVehiclesList() {
    return new Promise((resolve, reject) => {
        fetch('https://api.chargetrip.io/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'x-client-id':  process.env.CHARGETRIP_PROJECT_ID,
                'x-app-id': process.env.CHARGETRIP_APP_ID,
            },
            body: JSON.stringify({
                query: query,
                variables: { page: 0, size: 20 },
            })
        }).then(async (res) => {
            const r = await res.json();
            if (r.errors) {
              reject(r.errors[0].extensions)
            }
            const data = r.data;
            resolve(data.vehicleList);    
        }).catch((e) => {
            if (e) { 
              reject(e)
            };
        });
    });
}


module.exports = getVehiclesList;