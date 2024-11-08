import axios from "axios";

export function useDeleteMLCannedReply(threadId, access_token, apiUrl) {

    async function doDelete(threadId, access_token, apiUrl) 
    {
        let returnValue = await axios.patch(apiUrl + "/api/thread/" + threadId + "/canned-reply/delete", {
                threadId: threadId
            },
            {
                headers: {
                    Authorization: "Bearer " + access_token
                }
            }
        )
        .then((response) => {
            if (response.status == 200 && response.data.data == "deleted") {
                return true;
            }

        })
        .catch((err) => {
            return false;
        });

    }

    return doDelete(threadId, access_token, apiUrl);

}