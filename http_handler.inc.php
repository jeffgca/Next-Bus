<?php

/*
* class HTTPHandler
*/

class HTTPHandler {

    /*
    * __construct()
    * @param $endpoint
    */
    public  function __construct($endpoint) {
        $this->endpoint = $endpoint;
    }
    
    /**
     * Get: perform an HTTP GET operation using the currently set endpoint as
     * the base url
    */
    public function Get($uri=FALSE) { 
        if (!$uri) {
            $url = $this->endpoint;
        } else {
            $url = $this->_get_url($uri);
        }
        
        $success = FALSE;
        $get = curl_init($url);
        curl_setopt($get, CURLOPT_RETURNTRANSFER, TRUE);
        $response = curl_exec($get);
        $code = curl_getinfo($get, CURLINFO_HTTP_CODE);
        curl_close($get);
        
        $this->last_url = $url;
        
        if ($code == 200) {
            $success = TRUE;
        }
        
        $status = $this->_get_http_response($code);
        $out = array(
            'raw' => $response,
            'code' => $code,
            'status' => $status,
            'success' => $success,
        );
        return $this->_parse_resp((object) $out);
    }
    
    public function Post($uri, $data) {
        $fields = http_build_query($data, '', '&');
        $fields_count = count($data);
        $success = FALSE;
        $url = $this->_get_url($uri);
        $post = curl_init($url);
        
        curl_setopt($post, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($post, CURLOPT_POST, $count);
        curl_setopt($post, CURLOPT_POSTFIELDS, $fields);
        
        $response = curl_exec($post);
        $code = curl_getinfo($post, CURLINFO_HTTP_CODE);
        curl_close($post);
        if ($code == 200) {
            $success = TRUE;
        }
        
        $this->last_url = $url;
        
        $status = $this->_get_http_response($code);
    
        $out = array(
            'code' => $code,
            'raw' => $response,
            'status' => $status,
            'success' => $success,
        );
    
        return $this->_parse_resp((object) $out);
    }
    
    /**
     * get a nice explanation for common HTTP  response codes
     */
    private function _get_http_response($code) {
        // guidance from here:
        // http://stackoverflow.com/questions/408405/easy-way-to-test-a-url-for-404-in-php
        
        switch($code) {
            case 200:
                $resp_status="200: Success";
                break;
            case 401:
                $resp_status="401: Login failure.  Try logging out and back in.  Password are ONLY used when posting.";
                break;
            case 400:
                $resp_status="400: Invalid request.  You may have exceeded your rate limit.";
                break;
            case 404:
                $resp_status="404: Not found.";
                break;
            case 500:
                $resp_status="500: Twitter servers replied with an error. Hopefully they'll be OK soon!";
                break;
            case 502:
                $resp_status="502: Twitter servers may be down or being upgraded. Hopefully they'll be OK soon!";
                break;
            case 503:
                $resp_status="503: Twitter service unavailable. Hopefully they'll be OK soon!";
                break;
            default:
                $resp_status="Undocumented error: " . $code;
                break;
        }
        return $resp_status;
    }   
    
    protected function _get_url($uri) {
        if (!substr($uri, 0,1) === '/') {
            $uri = '/' . $uri;
        }
        return $this->endpoint . $uri;
    }
    
    protected function _parse_resp($resp) {
        if ($resp->success) {
            // if we were going to support other response formats, this is where we would do it.
            $resp->data = json_decode($resp->raw);
            return $resp;
        } else {
            throw new Exception($resp->status . ': ' . $this->last_url, $resp->code);
        }
    }
    
    protected function pp($data) {
        if (func_num_args() > 1) {
        $data = func_get_args();
        }
        return "<pre>".print_r($data, 1)."</pre>";
    }
    
    function _log($data) {
        if (DEBUG) {
            @file_put_contents(LOGFILE, print_r($data, 1));
        }
    }
    
}