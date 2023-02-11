<template>
  <BSCard>
    <template #content>
      {{tableConfig}}
    </template>
  </BSCard>
</template>

<script>
import { reqAgentQualification } from '@/api';
import { reactive, ref } from "@vue/runtime-core";
export default {
  name: 'AgentQualification',
  setup(){
    let tableConfig = reactive({
      data: []
    })

    initData();
    function initData(){
      reqAgentQualification({

      }).then(res => {
        if(res.code == 1){
          tableConfig.data = res.data.records;
        }
      }).catch(err => {

      })
    }

    return {
      tableConfig
    }
  }
}
</script>

<style>

</style>