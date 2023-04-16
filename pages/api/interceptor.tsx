export default function handler(req, res) {
    // リクエストを加工する処理
    req.headers['X-Interceptor'] = 'Hello Interceptor!';
    console.log('hello');
    res.status(200).json({ message: 'Hello World!' });
}
