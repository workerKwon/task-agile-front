import Logo from '../components/Logo'
import { useState } from 'react'
import PageFooter from '../components/PageFooter'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import registrationService from '../services/registration/registration'
import './stylesheet/register.scss'

interface RegisterForm {
  username: string
  emailAddress: string
  firstName: string
  lastName: string
  password: string
}

function RegisterPage() {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const submitForm = (data: RegisterForm) => {
    registrationService.register(data)
      .then(() => {
        navigate('/login')
      }).catch((error) => {
        setErrorMessage('Failed to register user. ' + error.message)
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>()

  return (
    <>
      <div className="container public">
        <div className="row justify-content-center">
          <div className="form">
            <Logo />
            <form onSubmit={handleSubmit(submitForm)} >
              { errorMessage &&
              <div className="alert alert-danger failed">
                { errorMessage }
              </div>
              }
              <div className="form-group">
                <label htmlFor="username">{ t('registerPage.form.username.label') }</label>
                <input
                  {...register('username',
                    { required: { value: true, message: t('registerPage.form.username.required') },
                      minLength: { value: 2, message: t('registerPage.form.username.minLength', { minLength: 2 }) },
                      maxLength: { value: 50, message: t('registerPage.form.username.maxLength', { maxLength: 50 }) },
                      pattern: { value: /[A-Za-z0-9]/, message: t('registerPage.form.username.alphaNum') } })}
                  id="username"
                  type="text"
                  className="form-control"
                />
                <div className="field-error">
                  <div className="error-block">
                    { errors.username?.message }
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="emailAddress">{ t('registerPage.form.emailAddress.label') }</label>
                <input
                  {...register('emailAddress',
                    { required: { value: true, message: t('registerPage.form.emailAddress.required') },
                      pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message:  t('registerPage.form.emailAddress.email') },
                      maxLength: { value:100, message: t('registerPage.form.emailAddress.maxLength', { maxLength: 100 }) } })}
                  id="emailAddress"
                  type="email"
                  className="form-control"
                />
                <div className="field-error">
                  <div className="error-block">
                    { errors.emailAddress?.message }
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="firstName">{ t('registerPage.form.firstName.label') }</label>
                <input
                  {...register('firstName',
                    { required: { value: true, message: t('registerPage.form.firstName.required') },
                      minLength: { value: 1, message: t('registerPage.form.firstName.minLength', { minLength: 1 }) },
                      maxLength: { value: 45, message: t('registerPage.form.firstName.maxLength', { maxLength: 45 }) },
                      pattern: { value: /[A-Za-z]/, message: t('registerPage.form.firstName.alpha') } })}
                  id="firstName"
                  type="text"
                  className="form-control"
                />

                <div className="field-error">
                  <div className="error-block">
                    { errors.firstName?.message }
                  </div>
                </div>

              </div>
              <div className="form-group">
                <label htmlFor="lastName">{ t('registerPage.form.lastName.label') }</label>
                <input
                  {...register('lastName',
                    { required: { value: true, message: t('registerPage.form.lastName.required') },
                      minLength: { value: 1, message: t('registerPage.form.lastName.minLength', { minLength: 1 }) },
                      maxLength: { value: 45, message: t('registerPage.form.lastName.maxLength', { maxLength: 45 }) },
                      pattern: { value: /[A-Za-z]/, message: t('registerPage.form.lastName.alpha') } })}
                  id="lastName"
                  type="text"
                  className="form-control"
                />
                <div className="field-error">
                  <div className="error">
                    { errors.lastName?.message }
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">{ t('registerPage.form.password.label') }</label>
                <input
                  {...register('password',
                    { required: { value: true, message:t('registerPage.form.password.required') },
                      minLength:{ value: 6, message: t('registerPage.form.password.minLength', { minLength: 6 }) },
                      maxLength:{ value: 30, message:t('registerPage.form.password.maxLength', { maxLength: 30 }) } })}
                  id="password"
                  type="password"
                  className="form-control"
                />
                <div className="field-error">
                  <div className="error">
                    { errors.password?.message }
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
              >
                { t('registerPage.form.submit') }
              </button>
              <p className="accept-terms text-muted">
                {/* <i18n */}
                {/*   path="registerPage.form.terms.accept" */}
                {/*   tag="p" */}
                {/*   className="accept-terms text-muted" */}
                {/* > */}
                {/* <a */}
                {/*   place="termsOfService" */}
                {/*   href="#" */}
                {/* >{ t('registerPage.form.terms.termsOfService') }</a> */}
                {/* <a */}
                {/*   place="privacyPolicy" */}
                {/*   href="#" */}
                {/* >{ t('registerPage.form.terms.privacyPolicy') }</a> */}
                {/* </i18n> */}
              </p>
              <p className="text-center text-muted">
                { t('registerPage.form.alreadyHaveAccount') }
                <Link to="login">
                  { t('registerPage.form.signIn') }
                </Link>
              </p>
            </form>
          </div>
        </div>
        <PageFooter />
      </div>
    </>
  )
}

export default RegisterPage
