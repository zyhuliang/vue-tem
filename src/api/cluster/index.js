import axios from "axios";

const base = process.env.NODE_ENV == "mock" ? "/mock" : "";

//获取集群注册是的备选值
export const clusterinfo = params => {
  return axios.get(`${base}/api/cluster/clusterinfo`).then(res => res);
};

//获取所有已经注册好的集群列表
export const clusterAll = params => {
  return axios.get(`${base}/api/cluster/all `).then(res => res);
};

//注册集群信息List 可以同时注册多个
export const createCluster = params => {
  return axios.post(`${base}/api/cluster/create`, params).then(res => res);
};

// list
export const listCluster = params => {
  return axios.post(`${base}/api/cluster/query`, params).then(res => res);
};

//  {idsArray}  #根据Id停用已经注册的集群信息
export const disableCluster = params => {
  return axios.post(`${base}/api/cluster/disable`, params).then(res => res);
};

// {idsArray}  #根据Id启用已经注册好的集群信息
export const enableCluster = params => {
  return axios.post(`${base}/api/cluster/enable`, params).then(res => res);
};

// {idsArray} #批量删除cluster注册信息
export const removeCluster = params => {
  return axios.post(`${base}/api/cluster/removeList`, params).then(res => res);
};

//update 集群
export const updateCluster = (params,id) =>{
  return axios.put(`${base}/api/cluster/update/${id}`,params).then(res=>res)
}

//卸载
export const cancleCluster = (id) =>{
  return axios.put(`${base}/api/cluster/cancle`,id).then(res=>res)
}

//下载
export const clusterDown =(ids)=>{
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    var srcPath = `${base}/api/cluster/downloadconf?X-AUTH-TOKEN=${sessionStorage["x-auth-token"]}&id=${ids}`
    iframe.src = srcPath
}