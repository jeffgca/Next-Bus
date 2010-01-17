<?php

require_once('./http_handler.inc.php');

class TranslinkProxy extends HTTPHandler {
    
    function __construct() {
        $endpoint = 'http://m.translink.ca/api';
        parent::__construct($endpoint);
    }
    
    function _get_stop_info($number) {
        $uri = '/stops/?q=' . $number;
        try {
            $raw = $this->Get($uri);
            return $raw->data;
        } catch (Exception $e) {
            return array('error' => $e->getMessage());
        }
    }
    
    function getBusTimes($number) {
        //$uri = 'http://m.translink.ca/stop/';
        $info = $this->_get_stop_info($number);
        
        if (isset($info->error)) {
            return json_encode($info);
        }
        
        $uri = '/stops/?s=' . $number;
        try {
            $raw = $this->Get($uri);
            return json_encode((object) array(
                'stop_info' => $info[0],
                'data' => $raw->data,
            ));
        /* @var $e Exception */
        } catch (Exception $e) {
            return json_encode(array('error' => $e->getMessage()));
        }
    }
    
    function pp($data) {
        if (func_num_args() > 1) {
            $data = func_get_args();
        }
        return "<pre>".print_r($data, 1)."</pre>";
    }
    
}

if (isset($_GET['stop'])) {
    if (is_numeric($_GET['stop'])) {
        $proxy = new TranslinkProxy();
        header('Content-type: application/json');
        echo  $proxy->getBusTimes((int) $_GET['stop']); exit;
        
    }
}
header('HTTP/1.0 400 Invalid Request');
echo array('error, invalid input'); exit;
