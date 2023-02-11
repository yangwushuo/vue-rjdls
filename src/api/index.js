import requests from './request'

export const reqCustomerLogin = (data) => {
  return requests({
    url: '/customer/login',
    method: 'post',
    data: data
  })
};

export const reqAgentLogin = (data) => {
  return requests({
    url: '/agent/login',
    method: 'post',
    data: data
  })
};

export const reqAdminLogin = (data) => {
  return requests({
    url: '/admin/login',
    method: 'post',
    data: data
  })
};

export const reqCustomerRegister = (data) => {
  return requests({
    url: '/customer/register',
    method: 'post',
    data: data
  })
}

// export const reqCustomerInfo = (params) => {
//   return requests({
//     url: '/customer/one',
//     method: 'get',
//     params
//   })
// }

// export const reqAgentInfo = (params) => {
//   return requests({
//     url: '/agent/one',
//     method: 'get',
//     params
//   })
// }

export const reqProducts = (params) => {
  return requests({
    url: '/product',
    method: 'get',
    params
  })
}

export const reqCustomerProducts = (data) => {
  return requests({
    url: '/customer/product/page',
    method: 'post',
    data
  })
}

export const reqFeedBack = (data) => {
  return requests({
    url: '/feedback',
    method: 'post',
    data
  })
}

export const reqFileUpload = (data) => {
  return requests({
    url: '/upload/single',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const reqBeAgent = (data) => {
  return requests({
    url: '/qualification/apply',
    method: 'post',
    data: data
  })
}

export const reqOrder = (data) => {
  return requests({
    url: '/order',
    method: 'post',
    data
  })
}

export const reqFeedBackManage = (params) => {
  return requests({
    url: '/feedback/agent',
    method: 'get',
    params
  })
}

export const reqUserInfoById = (params) => {
  return requests({
    url: '/customer/one',
    method: 'get',
    params
  })
}

export const reqUpFeedBack = (data) => {
  return requests({
    url: '/feedback',
    method: 'put',
    data
  })
}

export const reqAgentInfoById = (params) => {
  return requests({
    url: '/agent/one',
    method: 'get',
    params
  })
}

export const reqBalanceRecharge = (data) => {
  return requests({
    url: '/rechargeCharge',
    method: 'post',
    data
  })
}

export const reqAgentProductById = (params) => {
  return requests({
    url: '/agent/product/one',
    method: 'get',
    params
  })
}

export const reqAgentRefund = (data) => {
  return requests({
    url: '/refundApply/apply',
    method: 'post',
    data
  })
}

export const reqAgentRefundHistory = (params) => {
  return requests({
    url: '/refundApply/agent',
    method: 'get',
    params
  })
}

export const reqAgentPayHistory = (params) => {
  return requests({
    url: '/rechargeCharge/agent',
    method: 'get',
    params
  })
}

export const reqAgentQualification = (params) => {
  return requests({
    url: '/qualification',
    method: 'get',
    params
  })
}



