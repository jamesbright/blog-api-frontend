import Vue from 'vue'
import Router from 'vue-router'
//import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserBoard from '@/components/UserBoard'
import Admin from '@/components/Admin'
import WriteArticle from '@/components/WriteArticle'
import ReadArticle from '@/components/ReadArticle'
import EditArticle from '@/components/EditArticle'
import EditUser from '@/components/EditUser'
import Articles from '@/components/Articles'
import SuperAdmin from '@/components/SuperAdmin'
import RequestPasswordReset from '@/components/RequestPasswordReset'
import ResetPassword from '@/components/ResetPassword'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'articles',
      component: Articles
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      props:true,
      meta: {
        guest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        guest: true
      }
    },
    {
      path: '/dashboard',
      name: 'userboard',
      component: UserBoard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/write-article',
      name: 'writeArticle',
      component: WriteArticle,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/read-article/:id',
      name: 'readArticle',
      component: ReadArticle,
      props: true,

    },
    {
      path: '/edit-article/:id',
      name: 'editArticle',
      component: EditArticle,
      props: true,

    },
     {
      path: '/edit-user/:id',
      name: 'editUser',
      component: EditUser,
      props: true,

    },

    {
      path: '/articles',
      name: 'articles',
      component: Articles,

    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    },
    {
      path: '/super-admin',
      name: 'superAdmin',
      component: SuperAdmin,
      meta: {
        requiresAuth: true,
        is_superAdmin: true
      }
    },
    {
      path: '/request-password-reset',
      name: 'requestPasswordReset',
      component: RequestPasswordReset,

    }, {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword,

    },
  ]
})


router.beforeEach((to, from, next) => {
  if (to.fullPath == '/user-dashboard') {
    const is_admin = localStorage.getItem("myyin_adminUser");
    if (is_admin == 1) {
      next({
        path: '/admin',
        params: { nextUrl: to.fullPath }
      })
    } else {
      const is_superadmin = localStorage.getItem("myyin_superAdminUser");
      if (is_superadmin == 1) {
        next({
          path: '/super-admin',
          params: { nextUrl: to.fullPath }
        })
      } else {
        next({
          path: '/dashboard',
          params: { nextUrl: to.fullPath }
        })
      }
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('myyin_jwt') == null) {
      console.log(to.fullPath);
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let is_admin = JSON.parse(localStorage.getItem('myyin_adminUser'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (is_admin == 1) {
          next({params: { nextUrl: to.fullPath }})
        }
        else {
          next({ name: 'userboard', params: { nextUrl: to.fullPath } })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('myyin_jwt') == null) {
      next()
    }
    else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }

})



export default router