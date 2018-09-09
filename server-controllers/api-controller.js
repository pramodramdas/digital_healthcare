const { getWeb3Obj } = require("../server-utils/web3-util");

const fetchUserProfile = async (userAddress, callback) => {
    try {
        let profile = await getWeb3Obj().getHealthCare().checkProfile(userAddress);
        callback(null, profile);
    }
    catch(e) {
        console.log(e);
        callback("error");
    }
}

module.exports = {
    fetchUserProfile
}