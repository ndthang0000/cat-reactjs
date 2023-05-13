import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const params = location.split('/')
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    if (location.includes('project/detail/')) {
      breadcrumbs.push({
        pathname: location,
        name: params[params.length - 1],
        active: true,
      })
    }
    if (location.includes('project/translate/')) {
      breadcrumbs.push({
        pathname: 'project/detail/' + params[params.length - 2],
        name: params[params.length - 2],
        active: false,
      })
      breadcrumbs.push({
        pathname: location,
        name: params[params.length - 1],
        active: true,
      })

    }
    return breadcrumbs
  }
  const breadcrumbs = getBreadcrumbs(currentLocation)
  return (
    <CBreadcrumb className="m-0 ms-2 breadcrumb-custom ">
      <CBreadcrumbItem href="/">
        <Link to={'/project'}>
          Home
        </Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            className='breadcrumb-custom'
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {!breadcrumb.active ?
              <Link to={breadcrumb.pathname} >
                {breadcrumb.name} 
              </Link> : breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
