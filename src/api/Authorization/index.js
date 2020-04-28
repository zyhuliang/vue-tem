// import { axios } from "@components/utils/axiios.js";
// let base = '/api';

import axios from 'axios'

const base = process.env.NODE_ENV == 'mock' ? '/mock' : '/api'

// 令牌管理
export const getToken = params => { return axios.post(`${base}/auth/login`, params).then(res => res) }
export const updateToken = params => { return axios.post(`${base}/auth/refresh`, params).then(res => res) }
export const delToken = params => { return axios.post(`${base}/auth/revoke`, params).then(res => res) }

// 系统权限管理
export const deleteById = params => { return axios.post(`${base}/perm/deleteById`, params).then(res => res) }// 根据ID删除实体对象
export const infoById = params => { return axios.post(`${base}/perm/infoById`, params).then(res => res) }// 根据ID查询对象
export const listPage = params => { return axios.post(`${base}/perm/listPage`, params).then(res => res) }// 根据条件排序分页查询对象
export const save = params => { return axios.post(`${base}/perm/save`, params).then(res => res) }// 保存实体对象
export const saveList = params => { return axios.post(`${base}/perm/saveList`, params).then(res => res) }// 批量保存实体对象
export const updateById = params => { return axios.post(`${base}/perm/updateById`, params).then(res => res) }// 根据ID编辑对象

// 系统用户管理
export const deleteByIdUser = params => { return axios.post(`${base}/user/deleteById`, params).then(res => res) }// 根据ID删除实体对象
export const listPageUser = params => { return axios.post(`${base}/user/listPage`, params).then(res => res) }// 根据条件排序分页查询对象
export const saveUser = params => { return axios.post(`${base}/user/save`, params).then(res => res) }// 保存实体对象
export const saveListUser = params => { return axios.post(`${base}/user/saveList`, params).then(res => res) }// 批量保存实体对象
export const updateByIdUser = params => { return axios.post(`${base}/user/updateById`, params).then(res => res) }// 根据ID编辑对象

// 系统角色管理
export const deleteByIdRole = params => { return axios.post(`${base}/role/deleteById`, params).then(res => res) }// 根据ID删除实体对象
export const infoByIdRole = params => { return axios.post(`${base}/role/infoById`, params).then(res => res) }// 根据ID查询对象
export const listPageRole = params => { return axios.post(`${base}/role/listPage`, params).then(res => res) }// 根据条件排序分页查询对象
export const saveRole = params => { return axios.post(`${base}/role/save`, params).then(res => res) }// 保存实体对象
export const saveListRole = params => { return axios.post(`${base}/role/saveList`, params).then(res => res) }// 批量保存实体对象
export const updateByIdRole = params => { return axios.post(`${base}/role/updateById`, params).then(res => res) }// 根据ID编辑对象
