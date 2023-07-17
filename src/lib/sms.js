// Function to send the OTP via SMS using Africa's Talking API
function sendOTPViaSMS(phone_number, otp) {
  const apiKey = process.env.FSI_API_KEY;
  const apiUrl = "https://fsi.ng/api/v1/africastalking/version1/messaging";

  const myHeaders = new Headers();
  myHeaders.append("sandbox-key", apiKey);
  myHeaders.append("Content-Type", "application/json");

  const otpMessage = `Your OTP is: ${otp}. It will expire in 5 minutes.`;

  const raw = JSON.stringify({
    username: "sandbox",
    to: phone_number,
    message: otpMessage,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiUrl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

module.exports = { sendOTPViaSMS };

