import React,{useState} from 'react'
import axios from "axios";
import axiosInstance from 'src/axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const initFormValue={
  name:"",
  username :"",
  email:"",
  password:"",
  confirmPassword:"",

}

const isEmptyValue=(value)=>{
  return !value||value.trim().length<1
}

const isEmailValid=(email)=>{
  return /\S+@\S+\.\S+/.test(email)
}
const Register = () => {
  const navigate = useNavigate()
  const[formValue,setFormValue] = useState(initFormValue)
  const[formError, setFormError] = useState({})

  const validateForm=()=>{
    const error={}
    if(isEmptyValue(formValue.name)){
      error["name"]="Name is required"
    }
    if(isEmptyValue(formValue.username)){
      error["username"]="Username is required"
    }
    if(isEmptyValue(formValue.username)){
      error["email"]="Email is required"
    }else{
      if(!isEmailValid(formValue.email)){
        error["email"]="Email is invalid"
      }
    }
    if(isEmptyValue(formValue.password)){
      error["password"]="Password is required"
    }
    if(isEmptyValue(formValue.confirmPassword)){
      error["confirmPassword"]="Repeat password is required"
    }else if(formValue.confirmPassword!==formValue.password){
      error["confirmPassword"]="Repeat password is not match"
    }

    setFormError(error)
    return Object.keys(error).length===0
  }

  const handleChange=(event)=>{
    const{value,name}= event.target;
    setFormValue({
      ...formValue,
      [name]:value,
    })
  }

  const handleSubmit=(event)=>{
    event.preventDefault();
    if(validateForm()){
      console.log("form value", formValue)
      const userData={
        name:formValue.name,
        email:formValue.email,
        password:formValue.password
      }
      axiosInstance.post(`/auth/register`,userData).then((response)=>{
        console.log(response.status,response.data.token)
        toast.success('Register Successfully', { autoClose: 3000 })
        navigate('/login')
      })
    }else{
      console.log("form invalid")
    }
  }


    return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput name= "name" placeholder="Name" autoComplete="name"
                      value={formValue.name} 
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  {formError.username &&(
                      <div className="error-feedback" style={{color:"red", marginBottom :"15px", marginTop:"-10px", fontSize:"13px"}}>
                        {formError.name}
                      </div>
                    )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput name= "username" placeholder="Username" autoComplete="username"
                      value={formValue.username} 
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  {formError.username &&(
                      <div className="error-feedback" style={{color:"red", marginBottom :"15px", marginTop:"-10px", fontSize:"13px"}}>
                        {formError.username}
                      </div>
                    )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput name= "email" placeholder="Email" autoComplete="email" 
                      value={formValue.email}
                      onChange={handleChange}/>
                  </CInputGroup>
                  {formError.email &&(
                      <div className="error-feedback" style={{color:"red", marginBottom :"15px", marginTop:"-10px", fontSize:"13px"}}>
                        {formError.email}
                      </div>
                    )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name= "password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formValue.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  {formError.password&&(
                      <div className="error-feedback" style={{color:"red", marginBottom :"15px", marginTop:"-10px", fontSize:"13px"}}>
                        {formError.password}
                      </div>
                    )}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name= "confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={formValue.confirmPassword}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  {formError.confirmPassword&&(
                      <div className="error-feedback" style={{color:"red", marginBottom :"15px", marginTop:"-10px", fontSize:"13px"}}>
                        {formError.confirmPassword}
                      </div>
                    )}
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register