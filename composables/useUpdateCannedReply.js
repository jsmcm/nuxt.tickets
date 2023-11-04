import axios from "axios";

export function useUpdateCannedReply(cannedReplyId, message, title, useMl, access_token, apiUrl) {

    async function doUpdate(cannedReplyId, message, title, useMl, access_token, apiUrl) 
    {
        // console.log("about to delete");
        let returnValue = await axios.patch(apiUrl + "/api/canned-replies/" + cannedReplyId, {
            message : message,
            title   : title,
            use_ml  : useMl      
          },
          {
            headers: {
              Authorization: "Bearer " + access_token,
            }
          })
          .then((response) => {

            if (response.status == 200 && response.data.data == "updated") {
              return true;
            }
        
          })
          .catch((err) => {
            console.log("err: ");
            console.log(err);

            return false;
          });

          return false;
    }

    return doUpdate(cannedReplyId, message, title, useMl, access_token, apiUrl);

}