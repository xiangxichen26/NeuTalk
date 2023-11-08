function createUserList() {
    return [
        {
            username: 'admin',
            password: 'admin123456',
            token: 'admin-token',
        },
        {
            username: 'Wu Wang',
            password: 'ww123456',
            token: 'system-token',
        }
    ]
}

export default [
    //login api
    {
        url: '/api/user/login',
        method: 'post',
        response: ({ body }) => {
            // 获取请求体携带过来的信息
            const { username, password } = body;
            const checkUser = createUserList().find((item) => item.username === username && item.password === password);
            if (!checkUser) {
                return {
                    code: 201,
                    msg: '用户名或密码错误',
                }
            }
            const { token } = checkUser;
            return { code : 200, msg: '登录成功', data: {token} };
        }
    }
]