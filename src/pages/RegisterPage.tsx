import Logo from '../components/Logo'
import { useState } from 'react'
import PageFooter from '../components/PageFooter'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import registrationService from '../services/registration/registration'

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
                  {...register('username', { required: true, minLength: 2, maxLength: 50, pattern: /[A-Za-z\d]/ })}
                  id="username"
                  type="text"
                  className="form-control"
                />
                { errors.username &&
                  <div className="field-error">
                    <div
                      v-if="!$v.form.username.required"
                      className="error-block"
                    >
                      { t('registerPage.form.username.required') }
                    </div>
                    <div
                      v-if="!$v.form.username.alphaNum"
                      className="error-block"
                    >
                      { t('registerPage.form.username.alphaNum') }
                    </div>
                    <div
                      v-if="!$v.form.username.minLength"
                      className="error"
                    >
                      { t('registerPage.form.username.minLength', { minLength: $v.form.username.$params.minLength.min }) }
                    </div>
                    <div
                      v-if="!$v.form.username.maxLength"
                      className="error"
                    >
                      { t('registerPage.form.username.maxLength', { maxLength: $v.form.username.$params.maxLength.max }) }
                    </div>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="emailAddress">{ t('registerPage.form.emailAddress.label') }</label>
                <input
                  {...register('emailAddress', { required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, maxLength:100 })}
                  id="emailAddress"
                  type="email"
                  className="form-control"
                />
                { errors.emailAddress &&
                  <div className="field-error">
                    <div
                      v-if="!$v.form.emailAddress.required"
                      className="error-block"
                    >
                      { t('registerPage.form.emailAddress.required') }
                    </div>
                    <div
                      v-if="!$v.form.emailAddress.email"
                      className="error-block"
                    >
                      { t('registerPage.form.emailAddress.email') }
                    </div>
                    <div
                      v-if="!$v.form.emailAddress.maxLength"
                      className="error-block"
                    >
                      { t('registerPage.form.emailAddress.maxLength', { maxLength: $v.form.emailAddress.$params.maxLength.max }) }
                    </div>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="firstName">{ t('registerPage.form.firstName.label') }</label>
                <input
                  {...register('firstName', { required:true, minLength: 1, maxLength: 45, pattern: /[A-Za-z]/ })}
                  id="firstName"
                  type="text"
                  className="form-control"
                />
                {
                  errors.firstName &&
                  <div className="field-error">
                    <div
                      v-if="!$v.form.firstName.required"
                      className="error-block"
                    >
                      { t('registerPage.form.firstName.required') }
                    </div>
                    <div
                      v-if="!$v.form.firstName.alpha"
                      className="error-block"
                    >
                      { t('registerPage.form.firstName.alpha') }
                    </div>
                    <div
                      v-if="!$v.form.firstName.minLength"
                      className="error-block"
                    >
                      { t('registerPage.form.firstName.minLength', { minLength: $v.form.firstName.$params.minLength.min }) }
                    </div>
                    <div
                      v-if="!$v.form.firstName.maxLength"
                      className="error-block"
                    >
                      { t('registerPage.form.firstName.maxLength', { maxLength: $v.form.firstName.$params.maxLength.max }) }
                    </div>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="lastName">{ t('registerPage.form.lastName.label') }</label>
                <input
                  {...register('lastName', { required:true, minLength:1, maxLength:45, pattern: /[A-Za-z]/ })}
                  id="lastName"
                  type="text"
                  className="form-control"
                />
                {
                  errors.lastName &&
                  <div className="field-error">
                    <div
                      v-if="!$v.form.lastName.required"
                      className="error"
                    >
                      { t('registerPage.form.lastName.required') }
                    </div>
                    <div
                      v-if="!$v.form.lastName.alpha"
                      className="error"
                    >
                      { t('registerPage.form.lastName.alpha') }
                    </div>
                    <div
                      v-if="!$v.form.lastName.minLength"
                      className="error"
                    >
                      { t('registerPage.form.lastName.minLength', { minLength: $v.form.lastName.$params.minLength.min }) }
                    </div>
                    <div
                      v-if="!$v.form.lastName.maxLength"
                      className="error"
                    >
                      { t('registerPage.form.lastName.maxLength', { maxLength: $v.form.lastName.$params.maxLength.max }) }
                    </div>
                  </div>
                }
              </div>
              <div className="form-group">
                <label htmlFor="password">{ t('registerPage.form.password.label') }</label>
                <input
                  {...register('password', { required:true, minLength:6, maxLength:30 })}
                  id="password"
                  type="password"
                  className="form-control"
                />
                {
                  errors.password &&
                  <div className="field-error">
                    <div
                      v-if="!$v.form.password.required"
                      className="error"
                    >
                      { t('registerPage.form.password.required') }
                    </div>
                    <div
                      v-if="!$v.form.password.minLength"
                      className="error"
                    >
                      { t('registerPage.form.password.minLength', { minLength: $v.form.password.$params.minLength.min }) }
                    </div>
                    <div
                      v-if="!$v.form.password.maxLength"
                      className="error"
                    >
                      { t('registerPage.form.password.maxLength', { maxLength: $v.form.password.$params.maxLength.max }) }
                    </div>
                  </div>
                }
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
