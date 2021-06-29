<?php
/**
 * This is a simplified example of what the endpoint is doing in wordpress.
 * Some of the code is specific to the gitpod environment
 */

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);

$save_dir = __DIR__.'/files';
if( $_SERVER['REQUEST_METHOD'] == 'POST' ){
    header('Content-Type: application/json; charset="utf-8"');
    
    // we are going to be accepting a pdf
    $nonce = isset($_POST['nonce']) ? $_POST['nonce'] : null;

    // Here we would also verify the nonce, but for our example,
    // we are going to just accept any value
    if( !$nonce ){
        echo json_encode([
            'success' => false,
            'message' => 'Bad nonce'
        ]);
        exit;
    }
    // lets put this up here...
    $signature = isset( $_POST['signature'] ) ? $_POST['signature'] : null;
    $pdf = isset( $_POST['pdf'] ) ? $_POST['pdf'] : null;
    if( !$signature ){
        echo json_encode([
            'success' => false,
            'message' => 'no signature'
        ]);
        exit;
    }

    /**
     * we can also verify against the signature, but again, we are 
     * going to skip this for the sake of the example
     */

    if( !$pdf ){
        echo json_encode([
            'success' => false,
            'message' => 'no content'
        ]);
        exit;
    }

    $filename = md5($signature);

    $dir = $save_dir.'/'.$filename;
    if( !is_dir( $dir ) ){
        mkdir( $dir );
    }

    file_put_contents( $dir.'/index.html', '');
    $file = $dir.'/Proofpoint-ROI-Report.pdf';
    
    file_put_contents($file, base64_decode($pdf));
    
    // $url = get_permalink().'roi-pdf/'.md5($signature).'/';
    $base_url = "https://{$_SERVER[HTTP_HOST]}{$_SERVER[REQUEST_URI]}";


    echo json_encode([
        'success' => true,
        'url' => "$base_url?f={$filename}"
    ]);
    exit;
}
else {
    $filename = !empty($_REQUEST['f']) ? $_REQUEST['f'] : false;
    if( !$filename || !is_dir($save_dir.'/'.$filename) ){
        die('bad request');
    }
    // find the file...
    $dir = dir($save_dir.'/'.$filename);
    while(false !== ($f = $dir->read()) ){
        if( preg_match('/\.pdf$/', $f ) ){
            header('Content-Type: application/pdf');
            header("Content-Disposition: attachment; filename=\"$f\"");
            readfile($save_dir.'/'.$filename.'/'.$f );
            exit;
        }
    }
}