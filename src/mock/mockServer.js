
import Mock from 'mockjs';
import userinfo from './userinfo.json'

Mock.mock('/mock/login',{code:200, data: ''});
Mock.mock('/mock/userinfo',{code: 200, data: userinfo })
