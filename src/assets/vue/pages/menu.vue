<template>
  <f7-page>
    <f7-block-title>Main menu</f7-block-title>
    <f7-list>
      <f7-list-item link="/home/" title="Folders" panel-close>
      <f7-icon slot="media" icon="fa fa-folder fa-fw"></f7-icon>
      </f7-list-item>
      <f7-list-item link="/home/" title="Favorites" panel-close>
      <f7-icon slot="media" icon="fa fa-star fa-fw"></f7-icon>
      </f7-list-item>
      <f7-list-item link="/home/" title="Trash" panel-close>
      <f7-icon slot="media" icon="fa fa-trash fa-fw"></f7-icon>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
  export default {
  }
</script>
