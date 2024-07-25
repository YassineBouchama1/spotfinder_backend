export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    database: {
        Url: process.env.DB_URL,
        Port: process.env.DB_PORT,
        User: process.env.DB_USERNAME,
        Pass: process.env.DB_PASSWORD,
        Name: process.env.DB_DATABASE,
    },
    backend: {
        url: process.env.BACKEND_URL,
        port: process.env.BACKEND_PORT,
    }
});


export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  };