export const handleResponse = (response) => {
  response.message = response.data.message
  response.data = response.data.data
  return response
}

export const handleReponseError = (error) => {
  const { response } = error
  const { data } = response
  let err
  if (data) {
    err = {
      errMsg: data.message || data.error,
      errCode: data.errCode,
    }
  }
  return Promise.reject(err)
}
