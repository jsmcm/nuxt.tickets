import axios from "axios";

export function useUpdateMLCannedReply(threadId, message, cannedReplySlug, access_token, apiUrl) {

    async function doUpdate(threadId, message, cannedReplySlug, access_token, apiUrl) 
    {
        let returnValue = await axios.patch(apiUrl + "/api/thread/" + threadId, {
            message     : message,
            cannedReply : cannedReplySlug      
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

    return doUpdate(threadId, message, cannedReplySlug, access_token, apiUrl);

}