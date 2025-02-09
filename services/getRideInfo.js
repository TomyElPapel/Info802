const soap = require("soap");



async function getRideInfo(distance, autonomie, tempsChargement) {
    return new Promise((resolve, reject) => {
        soap.createClient(process.env.RIDE_INFO_SERVICE_HOST, async (err, client) => {
            if (err) {
                console.log(err);
            }
        
            const args = {distance: distance, autonomie: autonomie, chargement: tempsChargement};
        
        
            const tempsTrajet = await new Promise((resolve, reject) => {
                client.tempsTrajet(args, (err, result) => {
                    if (err) {
                        reject();
                        console.log(err);
                    }        
                    resolve(result.tempsTrajetResult)
                });
            });

            const prixTrajet = await new Promise((resolve, reject) => {
                client.prixTrajet(args, (err, result) => {
                    if (err) {
                        reject();
                        console.log(err);
                    }        
                    resolve(result.prixTrajetResult)
                });
            });

            resolve({
                price: prixTrajet,
                time: tempsTrajet
            });
        });
    });
}

module.exports = getRideInfo;