#
# Environment for tests
#
# Usage:
#   source source.env.sh && {run-tests} && unset_source_env



unset_source_env() {
    # env vars for tests
    unset EP_ASYNC_API_TEST_NONE
    unset EP_ASYNC_API_TEST_DATA_ROOT_DIR

    # unset this function
    unset -f unset_source_env
}

export EP_ASYNC_API_TEST_NONE="NONE"
# export EP_ASYNC_API_TEST_DATA_ROOT_DIR=""

######################################################

logName='[source.env.sh]'
echo "$logName - test environment:"
echo "$logName - EP_ASYNC_API_TEST:"
export -p | sed 's/declare -x //' | grep EP_ASYNC_API_TEST_

