 <template>
	<div class="loading_container">
    <div class="load_msg">
      {{this.msg}}
    </div>
	</div>
</template>
<script>
export default {
  name: "layer-msg",
  props: ["msg"]
};
</script>

<style scoped lang="stylus">
	@-webkit-keyframes load{
		0%   {opacity: 0;}
		10%  {opacity: 0.3;}
		20%  {opacity: 0.6;}
		30%  {opacity: 1;}
		40%  {opacity: 1;}
		50%  {opacity: 1;}
		60%  {opacity: 1;}
		70%  {opacity: 1;}
		80%  {opacity: 0.5;}
		90%  {opacity: 0.2;}
		100%  {opacity: 0;}
	}
	@-ms-keyframes load{
		0%   {opacity: 0;}
		10%  {opacity: 0.3;}
		20%  {opacity: 0.6;}
		30%  {opacity: 1;}
		40%  {opacity: 1;}
		50%  {opacity: 1;}
		60%  {opacity: 1;}
		70%  {opacity: 1;}
		80%  {opacity: 0.5;}
		90%  {opacity: 0.2;}
		100%  {opacity: 0;}
	}
	@-o-keyframes load{
		0%   {opacity: 0;}
		10%  {opacity: 0.3;}
		20%  {opacity: 0.6;}
		30%  {opacity: 1;}
		40%  {opacity: 1;}
		50%  {opacity: 1;}
		60%  {opacity: 1;}
		70%  {opacity: 1;}
		80%  {opacity: 0.5;}
		90%  {opacity: 0.2;}
		100%  {opacity: 0;}
	}
	@keyframes load{
		0%   {opacity: 0;}
		10%  {opacity: 0.5;}
		20%  {opacity: 1;}
		30%  {opacity: 1;}
		40%  {opacity: 1;}
		50%  {opacity: 1;}
		60%  {opacity: 1;}
		70%  {opacity: 1;}
		80%  {opacity: 1;}
		90%  {opacity: 0.2;}
		100%  {opacity: 0;}
	}
	.loading_container{
		position: fixed;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		 wh(13rem, 3.5rem);
	}
	.load_msg{
	 wh(100%, 100%);
    line-height: 46px;
    background: #666;
    color: #fff;
    text-align: center;
    font-size: 14px;
    padding: 0px 12px;
    border-radius: 6px;
		// background: url(/img/icon_loading.png) no-repeat 0 0;
		background-size: 100% auto;
		transform: translateY(0px);
		animation: load 4s ease-in-out forwards;
		position: relative;
		z-index: 11;
	}
</style>
