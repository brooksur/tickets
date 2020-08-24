import axios from 'axios'

export default ({ url, method, body = {} }) => async ({
  onSuccess,
  onFailure
}) => {
  try {
    const response = await axios[method](url, body)
    onSuccess(response)
  } catch ({ response }) {
    onFailure(response)
  }
}
