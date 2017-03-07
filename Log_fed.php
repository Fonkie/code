<?php  

/**
 * Class Log_fed
 * 即时日志查询：设置当前页面的cookie键值debug=1，ajax将输出所涉及到的后台接口信息apiInfo，包括原始请求参数以及响应值
 *
 * require_once BASEPATH . '/libraries/Log_fed.php';
 *
 * Example1:
	Log_fed::getInstance()->recordAppLog(array(
	"req" => array('url' => $url, 'data' => $data, 'method' => $method),
	"res" => array("body" => $res)
	), "api");
 *
 *
 * Example2:
	Log_fed::getInstance()->outputAppLog($data);
 *
 *
 */
class Log_fed {

	public $logData = array();

	public static $instance = null;

	private function __construct()
	{

	}

	public static function getInstance()
	{
		if (!self::$instance) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function checkPermission(){

		$ret = false;

		$isDebug = isset($_COOKIE['debug']) ? $_COOKIE['debug'] : '';
		if ( $isDebug ) {
			$ret = true;
		}

		return $ret;

	}

	public function recordAppLog($data, $type = "api")
	{
		if ( $this->checkPermission() ) {

			switch ($type) {
				case "api":

					if (isset($data["req"]["url"])) {
						$data["req"]["url"] = urldecode($data["req"]["url"]);
					}

					if (isset($data["req"]["body"])) {
						$body = $data["res"]["body"];
						$len = strlen($body);
						if ($len > 5000) {
							$body = substr($body, 0, 500) . "内容长度" . $len . ">10000，省略...";
						} else {
							$json = json_decode($body, true);
							if ($json) {
								$body = $json;
							}
						}
						$data["res"]["body"] = $body;
					}

					break;
			}
			if (!empty($data)) {
				$this->logData[] = $data;
			}

		}
	}

	public function outputAppLog( &$data = "",$type = "ajax")
	{
		if ( $this->checkPermission() ) {
			$_apiErrorLog = $this->logData;
			switch ($type) {
//				case "page":
//					global $template;
//					$template->assign("_apiErrorLog", $_apiErrorLog);
//					break;
				case "ajax":
					if (!empty($data) && is_array($data)) {
						$data["apiInfo"] = $_apiErrorLog;
					}
					break;
				case "js":
					echo '<script> if(console){console.log(' . json_encode($_apiErrorLog) . ');}</script>';
					break;
			}

		}
	}

}
