import axios from "axios";

export function useDeleteDepartment(departmentId, access_token, apiUrl) {

    async function doDelete(departmentId, access_token, apiUrl) 
    {
        // console.log("about to delete");
        let returnValue = await axios.delete(apiUrl + "/api/departments/" + departmentId, {
            headers: {
                Authorization: "Bearer " + access_token
            }
        })
        .then((response) => {
            // console.log("response:");
            // console.log(response);
            if (response.status == 200 && response.data.data == "deleted") {
                return true;
            }

        })
        .catch((err) => {
            // console.log("err: ");
            // console.log(err);
            return false;
        });

    }

    return doDelete(departmentId, access_token, apiUrl);

}