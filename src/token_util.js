import axios from "axios";
import Cookie from "universal-cookie";

export async function getTokenOrRefresh() {
  const cookie = new Cookie();
  const speechToken = cookie.get("speech-token");

  if (speechToken === undefined) {
    const speechKey = "3104d99bf6a94676bb67be645b8cabef";
    const speechRegion = "eastasia";
    const headers = {
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    var token = null;
    var region = null;

    const tokenResponse = await axios.post(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      headers
    );

    token = tokenResponse.data;
    region = speechRegion;

    cookie.set("speech-token", region + ":" + token, {
      maxAge: 540,
      path: "/",
    });

    return { authToken: token, region: region };
  } else {
    console.log("Token fetched from cookie: " + speechToken);
    const idx = speechToken.indexOf(":");
    return {
      authToken: speechToken.slice(idx + 1),
      region: speechToken.slice(0, idx),
    };
  }
}
