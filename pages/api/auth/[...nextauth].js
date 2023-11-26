// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
// };
// export default NextAuth(authOptions);

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100);
};

const randomHandler = (req, res) => {
  const randomNumber = generateRandomNumber();
  res.status(200).json({ number: randomNumber });
};

export default randomHandler;
