import Logo from '../components/Logo'
import PageFooter from '../components/PageFooter'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './stylesheet/login.scss'
import notify from '../utils/notify'
import authenticationService from '../services/authentication/authentication'

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState('')

  const { username, password } = form

  const onChange = (e: { target: { value: string, name: string } }) => {
    const {value, name} = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const submitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    authenticationService.authenticate(form).then(() => {
      navigate('/')
      // TODO
      // this.$bus.$emit('authenticated')
      notify.closeAll()
    }).catch((error: { message: string }) => {
      setErrorMessage(error.message)
    })
  }

  return (
    <>
    <div className="container public">
      <div className="row justify-content-center">
        <div className="form">
          <Logo />
          <form onSubmit={submitForm}>
            {
              errorMessage &&
              <div className="alert alert-danger failed">
                { errorMessage }
              </div>
            }
          <div className="form-group">
            <label htmlFor="username">{ t('loginPage.form.username.label') }</label>
            <input
              id="username"
              name="username"
              onChange={onChange}
              value={username}
              type="text"
              className="form-control"
            />
              <div
                // v-if="$v.form.username.$dirty"
                className="field-error"
              >
                <div
                  // v-if="!$v.form.username.required"
                  className="error"
                >
                  { t('loginPage.form.username.required') }
                </div>
              </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">{ t('loginPage.form.password.label') }</label>
            <input
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              type="password"
              className="form-control"
            />
              <div
                // v-if="$v.form.password.$dirty"
                className="field-error"
              >
                <div
                  // v-if="$v.form.password.required"
                  className="error"
                >
                  { t('loginPage.form.password.required') }
                </div>
              </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            { t('loginPage.form.submit') }
          </button>
          <div className="links">
            <p className="sign-up text-muted">
              { t('loginPage.form.noAccountYet') }
              <Link
                to="register"
                className="link-sign-up"
              >
                { t('loginPage.form.signUpHere') }
              </Link>
            </p>
            <p>
              <Link to="#">
                { t('loginPage.form.forgotPassword') }
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    <PageFooter />
    </div>
    </>
  )
}

export default LoginPage
