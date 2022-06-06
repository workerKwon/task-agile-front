import { useTranslation } from 'react-i18next'

function PageFooter() {
  const { t } = useTranslation()

  return (
    <>
      <footer className='footer'>
        <span className='copyright'>&copy; 2018 TaskAgile.com</span>
        <ul className='footer-links list-inline float-right'>
          <li className='list-inline-item'>
            <a href='#'>{t('pageFooter.about')}</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>{t('pageFooter.termOfService')}</a>
          </li>
          <li className='list-inline-item'>
            <a href='#'>Privacy Policy</a>
          </li>
          <li className='list-inline-item'>
            <a
              href='https://github.com/taskagile/vuejs.spring-boot.mysql'
              target='_blank'
              rel='noreferrer'
            >
              GitHub
            </a>
          </li>
        </ul>
      </footer>
    </>
  )
}

export default PageFooter
