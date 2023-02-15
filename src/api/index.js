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

export const reqPassBusinessLicense = (data) => {
  return requests({
    url: '/qualification/audit',
    method: 'post',
    data
  })
}

export const reqNoPassBusinessLicense = (data) => {
  return requests({
    url: '/qualification/audit',
    method: 'post',
    data
  })
}

export const reqDelBusinessLicense = (data) => {
  return requests({
    url: '/qualification',
    method: 'delete',
    data
  })
}

export const reqAgentInfo = (params) => {
  return requests({
    url: '/agent',
    method: 'get',
    params
  })
}

export const reqUpAgentInfo = (data) => {
  return requests({
    url: '/agent',
    method: 'put',
    data
  })
}

export const reqDelAgent = (data) => {
  return requests({
    url: '/agent',
    method: 'delete',
    data
  })
}

export const reqCustomerInfo = (params) => {
  return requests({
    url: '/customer',
    method: 'get',
    params
  })
}

export const reqUpCustomerInfo = (data) => {
  return requests({
    url: '/customer',
    method: 'put',
    data
  })
}

export const reqDelCustomer = (data) => {
  return requests({
    url: '/customer',
    method: 'delete',
    data
  })
}

export const reqRefundApply = (params) => {
  return requests({
    url: '/refundApply',
    method: 'get',
    params
  })
}

export const reqUpRefundApply = (data) => {
  return requests({
    url: '/refundApply/audit',
    method: 'post',
    data
  })
}

export const reqFeedBackByAdmin = (params) => {
  return requests({
    url: '/feedback/admin',
    method: 'get',
    params
  })
}

export const reqCooperation = (params) => {
  return requests({
    url: '/cooperation',
    method: 'get',
    params
  })
}

export const reqUpCooperation = (params) => {
  return requests({
    url: '/cooperation',
    method: 'put',
    params
  }) 
}

export const reqUpProduct = (data) => {
  return requests({
    url: '/product',
    method: 'put',
    data
  })
}

export const reqAddProduct = (data) => {
  return requests({
    url: '/product',
    method: 'post',
    data
  })
}

export const reqDelProduct = (data) => {
  return requests({
    url: '/product',
    method: 'delete',
    data
  })
}

export const reqAgentProductAssociation = (data) => {
  return requests({
    url: '/agent/product',
    method: 'post',
    data
  })
}

export const reqDelAllocation = (params) => {
  return requests({
    url: '/agent/product',
    method: 'delete',
    params
  })
}

export const reqAgentAllocationProductByProductId = (params) => {
  return requests({
    url: '/agent/product/agent',
    method: 'get',
    params
  })
}

export const reqUpCustomerPwd = (data) => {
  return requests({
    url: '/customer/pw',
    method: 'put',
    data
  })
}

export const reqUpAgentPwd = (data) => {
  return requests({
    url: '/agent/pw',
    method: 'put',
    data
  })
}

export const reqUpCustomerAvatar = (data) => {
  return requests({
    url: '/customer/avatar',
    method: 'put',
    data
  })
}

export const reqUpAgentAvatar = (data) => {
  return requests({
    url: '/agent/avatar',
    method: 'put',
    data
  })
}

export const reqAgentProductOrder = (data) => {
  return requests({
    url: '/order/page',
    method: 'post',
    data
  })
}

export const reqUpCustomerOrder = (params) => {
  return requests({
    url: '/order',
    method: 'put',
    params
  })
}

export const reqCustomerAllProducts = (data) => {
  return requests({
    url: '/product/cus',
    method: 'get',
    data
  })
}





