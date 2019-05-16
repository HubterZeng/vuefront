<template>
<div>
     <li @click="handleClick">{{content}}</li>
</div>
</template>
<script>
export default {
   props:['content','index'],
   methods:{
        handleClick:function(){
        this.$emit('delete',this.index)
      }
}
}
</script>

<style >

</style>
