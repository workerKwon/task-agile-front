import Logo from '../components/Logo'
import PageFooter from '../components/PageFooter'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './stylesheet/login.scss'
import notify from '../utils/notify'
import authenticationService from '../services/authentication/authentication'
import { useForm } from 'react-hook-form'

interface LoginForm {
  username: string
  password: string
}

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }} = useForm<LoginForm>()

  const [errorMessage, setErrorMessage] = useState('')

  const submitForm = (data: LoginForm) => {
    authenticationService.authenticate(data).then(() => {
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
          <form onSubmit={handleSubmit(submitForm)}>
            {
              errorMessage &&
              <div className="alert alert-danger failed">
                { errorMessage }
              </div>
            }
          <div className="form-group">
            <label htmlFor="username">{ t('loginPage.form.username.label') }</label>
            <input
              {...register('username', { required: true })}
              id="username"
              type="text"
              className="form-control"
            />
            {errors.username &&
              <div className="field-error">
                <div className="error-block">
                  { t('loginPage.form.username.required') }
                </div>
              </div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">{ t('loginPage.form.password.label') }</label>
            <input
              {...register('password', { required: true })}
              id="password"
              type="password"
              className="form-control"
            />
            {errors.password &&
              <div className="field-error">
                <div className="error-block">
                  { t('loginPage.form.password.required') }
                </div>
              </div>}
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
