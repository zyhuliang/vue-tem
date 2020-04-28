
import Mock from "mockjs";

Mock.mock("getStepData", {
    "list|5": [
      //随机返回5项
      {
        title: "@ctitle(5,20)",
        url: "@url" //随机生成url
      }
    ]
  });
  Mock.mock("tableList",{
    "list|5":[
      {
        title:'@ctitle(5,20)',
        url:"@url"
      }
    ]
  })
