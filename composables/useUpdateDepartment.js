import axios from "axios";


export function useUpdateDepartment(departmentId, departmentEmail, department, signature, logoUrl, mailHost ,mailUsername, mailPassword, popPort, smtpPort, apiBaseUrl, apiToken, access_token, apiUrl) {

    async function doUpdate(departmentId, departmentEmail, department, signature, logoUrl, mailHost ,mailUsername, mailPassword, popPort, smtpPort, apiBaseUrl, apiToken, access_token, apiUrl) 
    {
        // console.log("about to delete");
        let returnValue = await axios.patch(apiUrl + "/api/departments/" + departmentId, {
            departmentEmail : departmentEmail,
            department      : department,
            signature       : signature,
            logoUrl         : logoUrl,
            mailHost        : mailHost,
            mailUsername    : mailUsername,
            mailPassword    : mailPassword,
            popPort         : popPort,
            smtpPort        : smtpPort,
            apiBaseUrl      : apiBaseUrl,
            apiToken        : apiToken
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

    return doUpdate(departmentId, departmentEmail, department, signature, logoUrl, mailHost, mailUsername, mailPassword, popPort, smtpPort, apiBaseUrl, apiToken, access_token, apiUrl);

}