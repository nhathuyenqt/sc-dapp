import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    card :{
        height : '100%',
        display :'flex',
        flexDirection: 'column',
        width: '32rem',
        // marginLeft: '15rem', 
        // backgroundColor: '#3f4c6b'
        backgroundColor: theme.palette.background.paper
    },
    cardMedia : {
        paddingTop : '56.25%'
    },

    cardContent: {
        flexGrow:1
    },
    cardGrid: {
        padding: '20px 0'
    },
    icon: {
        marginRight: '20px'
    },

    buttons : {
        marginTop: '40px'
    },
    container: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #DFE0EB',
        borderRadius: 4,
        cursor: 'pointer',
        height: 70,
        maxWidth: 350,
        marginRight: 30,
        padding: '24px 32px 24px 32px',
        ':hover': {
            borderColor: '#3751FF',
            ':nth-child(n) > span': {
                color: '#3751FF'
            }
        }
    },
    titleline : {
        display :'flex',
        flexDirection: 'row',
        // justifycontent: space-between,
        // align-items: center,
        // marginbottom: 0.5rem,
        fontSize: '20px',
        color: '#FFFFFF',
    },
    field:{
        marginTop: 20,
        marginBottom: 10,
        display: 'block'
    }

}));

export default useStyles;

