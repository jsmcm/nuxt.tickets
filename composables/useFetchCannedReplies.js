import axios from "axios";

export async function useFetchCannedReplies(access_token, apiUrl) {

    try {
        const response = await axios.get(apiUrl + "/api/canned-replies", {
            headers: {
                Authorization: "Bearer " + access_token
            }
        });

        useSetWithExpiry("canned_replies", response.data.replies, 86400000);
        return response.data.replies;
    } catch (err) {
        console.log("err: ");
        console.log(err);

        return null;
    }
}