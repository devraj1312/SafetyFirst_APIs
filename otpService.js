import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


export const sendOtp = async (phone_no, otp) => {
  //   try {
    // const message = await client.messages.create({
      //   body: `Your OTP code is: ${otp}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phone_no
      // });
      //     return message;
      //   } catch (error) {
        //     throw Error('Failed to send OTP');
        //   }
        
        const message = `Your OTP is: ${otp}`;
        console.log(message)
        return;
        // return ({ message: 'OTP send successfully' });
};