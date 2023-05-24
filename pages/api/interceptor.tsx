export default function handler(req, res) {
    req.headers['X-Interceptor'] = 'Hello Interceptor!';
    res.status(200).json({ message: 'Hello World!' });
}
