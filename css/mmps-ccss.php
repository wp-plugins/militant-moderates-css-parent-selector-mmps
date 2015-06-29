<?php
header("Content-type: text/css");
$mmps_ccss = get_option('mmpsccss_settings');
$mmps_ccss = wp_kses( $mmps_ccss['mmps_ccss_main_style'], array( '\'', '\"' ) );
$mmps_ccss = str_replace ( array( '&gt;', '&lt;' ), array( '>', '<' ), $mmps_ccss );
echo $mmps_ccss;
?>